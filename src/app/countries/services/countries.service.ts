import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiURl: string = 'https://restcountries.com/v3.1';
  constructor(private httpClient: HttpClient) { }

  searchCountryByCode(code: string): Observable<Country | null> {
    return this.httpClient.get<Country[]>(`${this.apiURl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null)),
      );
  }

  searchCapital(term: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiURl}/capital/${term}`)
      .pipe(
        catchError(() => of([])),
      );
  }

  searchCountry(term: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiURl}/name/${term}`)
      .pipe(
        catchError(() => of([])),
      );
  }

  searchRegion(term: string): Observable<Country[]> {
    return this.httpClient.get<Country[]>(`${this.apiURl}/region/${term}`)
      .pipe(
        catchError(() => of([])),
      );
  }
}
