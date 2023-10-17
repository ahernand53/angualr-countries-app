import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';
import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiURl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: {term: '', countries: []},
    byCountries: {term: '', countries: []},
    byRegion: {countries: []},
  }

  constructor(private http: HttpClient) { }

  private getCountryRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url)
      .pipe(
        catchError(() => of([])),
      );
  }

  searchCountryByCode(code: string): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.apiURl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null)),
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiURl}/capital/${term}`)
      .pipe(
        tap((countries) => {
          this.cacheStore.byCapital = {term, countries};
        }),
      );
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiURl}/name/${term}`)
      .pipe(
        tap((countries) => {
          this.cacheStore.byCountries = {term, countries};
        }),
      );
  }

  searchRegion(term: Region): Observable<Country[]> {
    return this.getCountryRequest(`${this.apiURl}/region/${term}`)
      .pipe(
        tap((countries) => {
          this.cacheStore.byRegion = {
            region: term,
            countries
          };
        }),
      );
  }
}
