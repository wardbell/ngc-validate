# Ngc Validate

Demonstrates Model-Driven validation, in contrast to the Form-Driven validation that we are taught in the Angular docs.

The initial audience is a talk I'm giving at NgConf 2022 on Model-Driven Validation.

This project contains

1. A sample app, a mini-version of a Payroll Service Enrollment Application, to demonstrate model-driven validation with [Angular Forms](https://angular.io/guide/forms-overview) and the [vest.js validation library](https://vestjs.dev/).

1. The "glue" code to integrate Angular Forms with vest.js (see the `validation` folder.)

1. Suites of vest.js validation rules for the sample app (see the `validators` folder).

> Coincidentally, the sample app also demonstrates "Standalone Components" and other new features of Angular v14.

### Form-Driven Validation

In Form-Driven validation, each form component validates user input to _its own controls_ using validation rules embedded in the component's logic. These rules only are only applied when the user is entering data on that form. 

With [Angular Form validation](https://angular.io/guide/form-validation), you add validator functions ... one by one ... to each form control.

There are stock validators (`required`, `min`, `max`, ...) for common cases but you'll probably write custom validator functions for specific business rules and to cover the conditional application of a rule (ex: "_is required but only if some other field has value x_").

Developing, maintaining, and consistently applying these property-level rules quickly becomes overwhelming with even simple real world applications.

Other limitations are more severe:

* There is no mechanism for applying these rules outside of the form. 

* There is no way to detect if a user's change - perhaps a change that is valid on the current form - invalidates some other part of the domain model that isn't displayed on that form.

* While _individual_ validators are easy to test, testing that the form _applies all of the rules appropriately_ is hard.

### Model-Driven Validation

In Model-Driven validation, you extract validation rules into a separate "library" of rules that are aligned with the entities in the application's domain model. 

For example, the sample app has collections ("suites") of rules for the Company, Address, Employee, and EmployeeTax model types.

We still need to validate user form input. We do that by _wiring_ the "validation suites" into Angular Form validation.

The critical difference from Form Validation is that we can also validate models _outside_ of a form. That allows us to

* detect validation errors that propagate anywhere in the domain.
* unit test validation suites with mock model data.
* use the same validation rules on client and server.

## Vest validation Library

We write model validation rules in this project with the open-source [vest.js validation library](https://vestjs.dev/). 

Vest validation emulates the style of unit tests. Each vest validation rule is a "test". You collect these "tests" into "suites". You execute those suites to run validation.

Validation tests can be synchronous or asynchronous.

The vest validation suites in this sample app are all in the `validators` folder. For example, see `validators/address.sync-validations.ts`.

Vest is elegant, well-documented, easy to learn, and easy to use.
Check it out!

## Angular / Vest Integration

This project provides the "glue" code to integrate Angular Forms validation with vest validation suites.

All of the glue is in a few small files in the `validation` folder.
You can copy and re-purpose these files into your own application, following the example set here. Feel free to improve the glue!

A full description of the integration is TBD. Here is a brief summary.

Two special Angular validator functions in `validation/validation-fns.ts` - one synchronous and one synchronous - send the form control changes to model-specific vest validation suites. 

These are the _only validator functions_ a form control ever needs!

**Reactive Forms** developers can use `addValidatorsToControls` to add these validators to form controls as in this example:

```
protected generalForm = this.fb.group({
  legalName: '',
});

constructor(private fb: FormBuilder, private parent: NgForm) {
  addValidatorsToControls(this.generalForm.controls, companySyncValidationSuite);
}
```

**Template-Driven Forms** developers have even less to do, after a little setup.

First, you create mappings of "model type" to vest suites. Here is an example for the _Address_ and _Company_ synchronous validation suites:

  ```
  export const syncValidationSuites: Indexable<ValidationSuite> = {
    address: addressSyncValidationSuite,
    company: companySyncValidationSuite,
  };
  ```

Then you register these mappings with Angular dependency injection, perhaps in `main.ts`.
```
{ provide: SYNC_VALIDATION_SUITES, useValue: syncValidationSuites },
```

**_Setup is done!_** 

Now your validation suites will be discoverable by the `FormFieldNgModelDirective` that wires your validation suites to HTML elements with `ngModel` attributes.

The `FormFieldNgModelDirective` automatically adds configured validators to the `NgModelControl` that Angular silently creates for an element with an `ngModel` attribute. 

Here's an example:
```
<input name="legalName" [(ngModel)]="vm.legalName" [model]="vm" modelType="company">
```

The `name` is the model property to validate. The `[model]` is the data model. The `modelType` identifies the validation suite, via the mapping you setup earlier.

It would be tedious to repeat the `model` and `modelType` for every form field. Fortunately you don't have to.

You can set the "validation scope" at a higher level of the form control tree, thanks to the `FormValidationModelDirective`.

If you don't specify the `model` and `modelType` at the element level, the `FormFieldNgModelDirective` will look up the control tree for the nearest validation scope.

In this next example, we set the validation scope at the `<form>` element.

```
<form [model]="vm" modelType="company">
```

Now we can re-write the early `<input>` example, omitting the `model` and `modelType`, knowing that these values will be found at the `<Form>` level:
```
<input name="legalName" [(ngModel)]="vm.legalName">
```

Notice that there is no special markup on that `<input>` element. It looks like a normal Angular `ngModel` binding ... and it _just works_!

## Simplify with Input Wrappers

A typical application presents and asks for user input in a consistent way. For example, you might show
* a label, 
* an input element, 
* an error message when the field fails validation. 

The HTML for that pattern could look like this:

```
<mat-form-field class="col full-width">
  <input matInput placeholder="Size" name="size" [(ngModel)]="vm.size" input="ngModel">
  <mat-error *ngIf="input.errors" class="full-width">
    {{ input.errors['error'] }}
  </mat-error>
</mat-form-field>
```

Such repetitive HTML makes for an ugly, bloated template after only a few fields. 

We strongly suggest that you wrap such patterns in custom input components, tailored to your application. You can also hide that ugly `ngModel` attribute while your at it.

Here is what that same HTML _could_ look like, using the `InputTextComponent` in the `widgets` folder:

```
<input-text name="size" placeholder="Size"></input-text>
```

Of course you'll want to adapt that component to your application needs.

# Building and Running

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
