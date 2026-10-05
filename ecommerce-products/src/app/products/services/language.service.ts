import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'mr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly STORAGE_KEY =
    'shopzones-language';

  private languageSubject =
    new BehaviorSubject<Language>(
      this.getInitialLanguage()
    );

  language$ =
    this.languageSubject.asObservable();

  constructor() {

    window.addEventListener(
      'shopzones-language-change',
      this.handleLanguageChange
    );
  }

  private getInitialLanguage(): Language {

    const language =
      localStorage.getItem(
        this.STORAGE_KEY
      );

    return language === 'mr'
      ? 'mr'
      : 'en';
  }

  getLanguage(): Language {
    return this.languageSubject.value;
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
      this.languageSubject.next(language);
    }
  };
}