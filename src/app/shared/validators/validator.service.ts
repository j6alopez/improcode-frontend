import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validator, ValidatorFn } from '@angular/forms';

@Injectable( {
  providedIn: 'root'
} )
export class ValidatorService {

  public static onlyLettersPattern: string = '^[a-zA-Z]+$';
  public static emailPattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public static firstNameAndLastnamePattern: string = '^[a-zA-Z]+ [a-zA-Z]+(?: [a-zA-Z]+)*$';
  public static spanishPhonePattern: string = '^[679][0-9]{8}$';
  public static onlyNumbersPattern: string = '^[1-9]\d*$';
  public static datePattern: string = '^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$'

  public isFielOneGreaterThanFieldTwo( field1: string, field2: string ): ValidatorFn {
    return ( control: AbstractControl ): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const fieldValue1 = formGroup.get( field1 )?.value;
      const fieldValue2 = formGroup.get( field2 )?.value;

      if ( fieldValue1 <= fieldValue2 ) {
        formGroup.get( field2 )?.setErrors( { notEqual: true } );
        return { notGreater: true };
      }

      formGroup.get( field2 )?.setErrors( null );
      return null;
    }
  }

  public isFielOneGreaterThanFieldTwoDates( field1: string, field2: string ): ValidatorFn {
    return ( control: AbstractControl ): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const fieldValue1 = new Date( formGroup.get( field1 )?.value );
      const fieldValue2 = new Date( formGroup.get( field2 )?.value );

      if ( fieldValue1 <= fieldValue2 ) {
        formGroup.get( field2 )?.setErrors( { notEqual: true } );
        return { notGreater: true };
      }

      formGroup.get( field2 )?.setErrors( null );
      return null;
    }
  }
  public isNotValidField( form: FormGroup, field: string ): boolean | null {
    return form.controls[ field ].errors
      && form.controls[ field ].touched;
  }

  public isEmptyOrNull(form: FormGroup, field: string): boolean {
    const value: string = form.get(field)?.value;
    return value === '' || value === null || value === undefined;
  }

}
