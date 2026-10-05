import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Language = 'en' | 'mr';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private readonly STORAGE_KEY = 'shopzones-language';

  private languageSubject = new BehaviorSubject<Language>(
    this.getInitialLanguage()
  );

  language$ = this.languageSubject.asObservable();

  constructor() {
    window.addEventListener(
      'shopzones-language-change',
      this.handleLanguageChange
    );
  }

  private getInitialLanguage(): Language {
    const savedLanguage =
      localStorage.getItem(this.STORAGE_KEY);

    return savedLanguage === 'mr' ? 'mr' : 'en';
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }

  setLanguage(language: Language): void {

    localStorage.setItem(
      this.STORAGE_KEY,
      language
    );

    this.languageSubject.next(language);

    window.dispatchEvent(
      new CustomEvent(
        'shopzones-language-change',
        {
          detail: language
        }
      )
    );
  }

  private handleLanguageChange = (event: Event): void => {

    const customEvent =
      event as CustomEvent<Language>;

    const language = customEvent.detail;

    if (language === 'en' || language === 'mr') {
      this.languageSubject.next(language);
    }
  };

  destroy(): void {
    window.removeEventListener(
      'shopzones-language-change',
      this.handleLanguageChange
    );
  }
}