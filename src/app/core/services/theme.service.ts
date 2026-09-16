import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { STORAGE_KEYS } from '../constants/storage-keys';
import { StorageService } from './storage.service';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = inject(StorageService);
  readonly mode = signal<ThemeMode>(this.readInitialMode());

  constructor() {
    this.apply(this.mode());
  }

  toggle(): void {
    this.setMode(this.mode() === 'dark' ? 'light' : 'dark');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.storage.set(STORAGE_KEYS.theme, mode);
    this.apply(mode);
  }

  private readInitialMode(): ThemeMode {
    const stored = this.storage.get<ThemeMode>(STORAGE_KEYS.theme);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    return this.document.defaultView?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private apply(mode: ThemeMode): void {
    const root = this.document.documentElement;
    root.classList.toggle('theme-dark', mode === 'dark');
    root.classList.toggle('theme-light', mode === 'light');
    root.style.colorScheme = mode;
  }
}
