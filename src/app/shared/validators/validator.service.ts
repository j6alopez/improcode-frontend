import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  public static emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  public isFielOneGreaterThanFieldTwo(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const fieldValue1 = formGroup.get(field1)?.value;
      const fieldValue2 = formGroup.get(field2)?.value;
      if( fieldValue1 !>= fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true}) ;
        return { notGreater: true };
      }

      formGroup.get(field2)?.setErrors(null) ;
      return null;
    }
  }

  public isFielOneGreaterThanFieldTwoDates(field1: string, field2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const fieldValue1 = new Date(formGroup.get(field1)?.value);
      const fieldValue2 = new Date(formGroup.get(field2)?.value);
      if( fieldValue1 <= fieldValue2) {
        formGroup.get(field2)?.setErrors({ notEqual: true}) ;
        return { notGreater: true };
      }

      formGroup.get(field2)?.setErrors(null) ;
      return null;
    }
  }
  public isNotValidField( form: FormGroup, field: string ): boolean | null {
    return form.controls[ field ].errors
      && form.controls[ field ].touched;
  }

}
