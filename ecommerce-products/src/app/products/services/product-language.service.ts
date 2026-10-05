import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, tap } from 'rxjs';

import {
  Language
} from './language.service';

@Injectable({
  providedIn: 'root'
})
export class ProductLanguageService {

  private translations: any = {};

  private languageSubject =
    new BehaviorSubject<Language>(
      this.getInitialLanguage()
    );

  language$ =
    this.languageSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {

    window.addEventListener(
      'shopzones-language-change',
      this.handleLanguageChange
    );
  }

  loadLanguage(
    language: Language
  ): Observable<any> {

    return this.http
      .get(
        `assets/i18n/${language}.json`
      )
      .pipe(
        tap((response) => {

          this.translations =
            response;

          this.languageSubject.next(
            language
          );
        })
      );
  }

  translate(key: string): string {

    return key
      .split('.')
      .reduce(
        (value, property) =>
          value?.[property],
        this.translations
      ) || key;
  }

  private getInitialLanguage(): Language {

    return localStorage.getItem(
      'shopzones-language'
    ) === 'mr'
      ? 'mr'
      : 'en';
  }

  private handleLanguageChange = (
    event: Event
  ): void => {

    const customEvent =
      event as CustomEvent<Language>;

    const language =
      customEvent.detail;

    if (
      language === 'en' ||
      language === 'mr'
    ) {

      this.loadLanguage(language)
        .subscribe();
    }
  };
}