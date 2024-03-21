import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { BehaviorSubject, Observable, catchError, combineLatest, filter, map, of, shareReplay, switchMap, tap } from 'rxjs';
import { Product } from './product';
import { HttpErrorService } from '../utilities/http-error.service';
import { ReviewService } from '../reviews/review.service';
import { Review } from '../reviews/review';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Result } from '../shared/result';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsUrl = 'api/products';

  constructor(
    private http: HttpClient,
    private errorService: HttpErrorService,
    private reviewService: ReviewService
  ) { }

  //#region Get Products
  private productsResult$ = this.http.get<Product[]>(this.productsUrl)
    .pipe(
      map(p => ({ data: p, error: undefined } as Result<Product[]>)),
      tap(p => console.log(`In http.get pipeline`, JSON.stringify(p))),
      shareReplay(1),
      catchError(err => of({ data: [], error: this.errorService.formatError(err) } as Result<Product[]>))
    );

  private productsResult = toSignal(this.productsResult$,
    { initialValue: ({ data: [] } as Result<Product[]>) });

  products = computed(() => this.productsResult().data);
  productsError = computed(() => this.productsResult().error);
  //#endregion
  //#region Get selected Product
  selectedProductId = signal<number | undefined>(undefined);

  // Find the product in the existing array of products
  private foundProduct = computed(() => {
    // Dependent signals
    const p = this.products();
    const id = this.selectedProductId();
    if (p && id) {
      return p.find(product => product.id === id);
    }
    return undefined;
  });

  private productResult$ = toObservable(this.foundProduct)
    .pipe(
      filter(Boolean),
      switchMap(product => this.getProductWithReview(product)),
      map(p => ({ data: p } as Result<Product>)),
      catchError(err => of({
        data: undefined,
        error: this.errorService.formatError(err)
      } as Result<Product>))
    );

  private productResult = toSignal(this.productResult$,
    { initialValue: ({ data: undefined } as Result<Product>) });

  product = computed(() => this.productResult()?.data);
  productError = computed(() => this.productResult()?.error);
  //#endregion
  //#region Methods
  productSelected(selectedProductId: number): void {
    this.selectedProductId.set(selectedProductId);
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
  //#endregion
}
