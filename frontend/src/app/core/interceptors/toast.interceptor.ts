import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { catchError, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const toastInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        // Only trigger success toasts for mutation methods: POST, PUT, PATCH, DELETE
        const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
        
        if (isMutation) {
          const body = event.body as any;
          if (body) {
            // Check if backend returned our standard ApiResponse structure
            const hasSuccessField = body && typeof body === 'object' && 'success' in body;
            const success = hasSuccessField ? body.success : (event.status >= 200 && event.status < 300);
            const message = body.message;

            if (success) {
              if (message) {
                toastService.success(message);
              } else {
                // Fallback messages based on HTTP Method
                if (req.method === 'POST') toastService.success('Record created successfully.');
                else if (req.method === 'DELETE') toastService.success('Record deleted successfully.');
                else toastService.success('Record updated successfully.');
              }
            } else {
              // This is a Business Failure (success: false even if HTTP status is 2xx)
              const errorMessage = message || 'Operation failed. Please check your inputs.';
              toastService.error(errorMessage);
            }
          }
        }
      }
    }),
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse) {
        let errorMessage = '';

        // 1. Check if backend returned our standard ApiResponse wrapper containing the error message
        if (error.error && typeof error.error === 'object') {
          if (error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error.error) {
            errorMessage = error.error.error;
          }
        }

        // 2. Fall back to standard HTTP error details if no backend message is provided
        if (!errorMessage) {
          if (error.message) {
            errorMessage = error.message;
          }
        }

        // 3. Apply HTTP status code fallback messages
        if (!errorMessage || errorMessage.toLowerCase().includes('unknown error') || error.status === 0) {
          switch (error.status) {
            case 0:
              errorMessage = 'Unable to connect to the server. Please check your connection.';
              break;
            case 400:
              errorMessage = 'Invalid request. Please check your information.';
              break;
            case 401:
              errorMessage = 'Your session has expired. Please login again.';
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'Requested resource was not found.';
              break;
            case 409:
              errorMessage = 'This record already exists.';
              break;
            case 500:
              errorMessage = 'Something went wrong on the server. Please try again.';
              break;
            default:
              errorMessage = `An unexpected error occurred (HTTP ${error.status}).`;
          }
        }

        toastService.error(errorMessage);
      }
      return throwError(() => error);
    })
  );
};
