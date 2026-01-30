import { HttpInterceptorFn } from '@angular/common/http';

export const localtunnelInterceptor: HttpInterceptorFn = (req, next) => {
  // Check if request is going to a localtunnel URL
  if (req.url.includes('.loca.lt')) {
    // Clone the request and add the bypass header
    const modifiedReq = req.clone({
      setHeaders: {
        'bypass-tunnel-reminder': 'true',
      },
    });
    return next(modifiedReq);
  }

  return next(req);
};
