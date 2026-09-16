import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Country } from '../../../core/models/country.model';
import { Trip, TripActivity, TripDay } from '../../../core/models/trip.model';
import { DestinationSearchComponent } from '../../../shared/components/destination-search/destination-search.component';
import { UnsavedChangesComponent } from '../../../core/guards/unsaved-changes.guard';
import { endDateAfterStartDate } from '../../../core/utils/date.validators';
import { createId } from '../../../core/utils/id';
import { TripFacade } from '../services/trip.facade';

type ActivityForm = FormGroup<{
  id: FormControl<string>;
  time: FormControl<string>;
  title: FormControl<string>;
  notes: FormControl<string>;
}>;

type DayForm = FormGroup<{
  id: FormControl<string>;
  label: FormControl<string>;
  activities: FormArray<ActivityForm>;
}>;

@Component({
  selector: 'app-trip-editor-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    DragDropModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    DestinationSearchComponent,
  ],
  templateUrl: './trip-editor-page.component.html',
  styleUrl: './trip-editor-page.component.scss',
})
export class TripEditorPageComponent implements OnInit, UnsavedChangesComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly facade = inject(TripFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly saving = signal(false);
  readonly tripId = signal<string | null>(null);
  private saved = false;

  readonly form = this.fb.group(
    {
      name: this.fb.control('', [Validators.required, Validators.maxLength(80)]),
      destinationCode: this.fb.control('', Validators.required),
      destinationName: this.fb.control('', Validators.required),
      startDate: this.fb.control<Date | null>(null, Validators.required),
      endDate: this.fb.control<Date | null>(null, Validators.required),
      travelers: this.fb.control(2, [Validators.required, Validators.min(1), Validators.max(20)]),
      estimatedBudget: this.fb.control(0, [Validators.required, Validators.min(0)]),
      currency: this.fb.control('USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]),
      notes: this.fb.control(''),
      days: this.fb.array<DayForm>([]),
    },
    { validators: endDateAfterStartDate('startDate', 'endDate') },
  );

  get days(): FormArray<DayForm> {
    return this.form.controls.days;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.tripId.set(id);
    if (id) {
      const trip = this.facade.getById(id);
      if (!trip) {
        void this.router.navigate(['/trips']);
        return;
      }
      this.patchTrip(trip);
    } else {
      this.addDay();
      const destination = this.route.snapshot.queryParamMap.get('destination');
      if (destination) {
        this.form.patchValue({ destinationCode: destination, destinationName: destination });
      }
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saved;
  }

  chooseDestination(country: Country): void {
    this.form.patchValue({
      destinationCode: country.code,
      destinationName: country.name,
      currency: country.currencies[0]?.code ?? this.form.controls.currency.value,
    });
    this.form.markAsDirty();
  }

  addDay(): void {
    const index = this.days.length + 1;
    this.days.push(this.createDay(`Day ${index}`));
    this.form.markAsDirty();
  }

  removeDay(index: number): void {
    this.days.removeAt(index);
    this.form.markAsDirty();
  }

  addActivity(day: DayForm): void {
    day.controls.activities.push(this.createActivity());
    this.form.markAsDirty();
  }

  removeActivity(day: DayForm, index: number): void {
    day.controls.activities.removeAt(index);
    this.form.markAsDirty();
  }

  dropActivity(day: DayForm, event: CdkDragDrop<TripActivity[]>): void {
    const activities = day.controls.activities;
    moveItemInArray(activities.controls, event.previousIndex, event.currentIndex);
    activities.updateValueAndValidity();
    this.form.markAsDirty();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const value = this.form.getRawValue();
    const payload = {
      name: value.name,
      destinationCode: value.destinationCode,
      destinationName: value.destinationName,
      startDate: this.toDateString(value.startDate),
      endDate: this.toDateString(value.endDate),
      travelers: value.travelers,
      estimatedBudget: value.estimatedBudget,
      currency: value.currency.toUpperCase(),
      notes: value.notes,
      days: value.days.map(
        (day): TripDay => ({
          id: day.id,
          label: day.label,
          activities: day.activities.map(
            (activity): TripActivity => ({
              id: activity.id,
              time: activity.time,
              title: activity.title,
              notes: activity.notes,
            }),
          ),
        }),
      ),
    };

    const id = this.tripId();
    const savedTrip = id ? this.facade.update(id, payload) : this.facade.create(payload);
    this.saving.set(false);
    if (savedTrip) {
      this.saved = true;
      void this.router.navigate(['/trips', savedTrip.id]);
    }
  }

  fieldError(name: 'name' | 'destinationName' | 'travelers' | 'estimatedBudget' | 'currency'): string {
    const control = this.form.controls[name];
    if (!control.touched || !control.errors) {
      return '';
    }
    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['min']) {
      return 'Enter a value greater than zero.';
    }
    return 'Check this field and try again.';
  }

  dateError(): string {
    if (this.form.hasError('endBeforeStart') && this.form.touched) {
      return 'The end date must be on or after the start date.';
    }
    if (this.form.controls.startDate.touched && this.form.controls.startDate.hasError('required')) {
      return 'Start and end dates are required.';
    }
    return '';
  }

  private patchTrip(trip: Trip): void {
    this.form.patchValue({
      name: trip.name,
      destinationCode: trip.destinationCode,
      destinationName: trip.destinationName,
      startDate: new Date(trip.startDate),
      endDate: new Date(trip.endDate),
      travelers: trip.travelers,
      estimatedBudget: trip.estimatedBudget,
      currency: trip.currency,
      notes: trip.notes,
    });
    this.days.clear();
    trip.days.forEach((day) => this.days.push(this.createDay(day.label, day)));
  }

  private createDay(label: string, day?: TripDay): DayForm {
    const activities = this.fb.array<ActivityForm>([]);
    const source = day?.activities?.length ? day.activities : [{ id: createId('act'), time: '09:00', title: '', notes: '' }];
    source.forEach((activity) => activities.push(this.createActivity(activity)));
    return this.fb.group({
      id: this.fb.control(day?.id ?? createId('day')),
      label: this.fb.control(label, Validators.required),
      activities,
    });
  }

  private createActivity(activity?: TripActivity): ActivityForm {
    return this.fb.group({
      id: this.fb.control(activity?.id ?? createId('act')),
      time: this.fb.control(activity?.time ?? '09:00', Validators.required),
      title: this.fb.control(activity?.title ?? '', Validators.required),
      notes: this.fb.control(activity?.notes ?? ''),
    });
  }

  private toDateString(value: Date | null): string {
    if (!value) {
      return '';
    }
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
