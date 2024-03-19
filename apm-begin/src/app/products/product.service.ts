import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, concatMap, map, mergeMap, of, switchMap, tap } from 'rxjs';
import { Product } from './product';
import { ProductData } from './product-data';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // Just enough here for the code to compile
  private productsUrl = 'api/products';

  constructor(
    private http: HttpClient,
    private errorService: HttpErrorService,
    private reviewService: ReviewService
  ) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl)
      .pipe(
        tap(p => console.log(`In http.get pipeline`, p)),
        catchError(err => this.handleError(err))
      );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${id}`)
      .pipe(
        tap(p => console.log(`In http.get pipeline`, p)),
        switchMap(p => this.getProductWithReview(p)),
        catchError(err => this.handleError(err))
      );
  }

  getProductWithReview(product: Product): Observable<Product> {
    if (!product.hasReviews) return of(product);

    return this.http.get<Review[]>(this.reviewService.getReviewUrl(product.id))
      .pipe(
        tap(p => console.log(`In http.get pipeline`, p)),
        map(reviews => ({ ...product, reviews } as Product)),
        catchError(err => this.handleError(err))
      );
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    const formattedMessage = this.errorService.formatError(err);
    throw formattedMessage;
  }
}
