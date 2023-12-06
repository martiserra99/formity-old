# formity

Create dynamic react forms with just a json.

## ❯ Install

```bash
npm install --save formity
```

## ❯ Overview

This library lets you create advanced dynamic forms for React applications. The forms that you can create using this library can have multiple steps and the questions asked in each step can depend on the answers provided on the previous ones.

These forms are created using only json objects providing you with some capabilities you wouldn't have otherwise. You can store them as json files, send them through the network and even store them in a database like MongoDB.

## ❯ Example

We suggest you to clone the following repo to give you an idea about how this library is used and what it lets you do:

```bash
git clone https://github.com/martiserra99/formity-example.git
cd formity-example
npm install
npm run dev
```

## ❯ How To Use

This library uses [react-hook-form](https://www.npmjs.com/package/react-hook-form) and [mongu](https://www.npmjs.com/package/mongu) under the hood. We advise you to learn how they work before learning about this package.

### FormityProvider

To start using the library you have to use the `FormityProvider` component to define the components that will be used by your form:

```js
// ...

import { FormityProvider } from 'formity';

const components = {
  LayoutForm: LayoutForm,
  TextField: TextField,
  TextArea: TextArea,
  Select: Select,
  RadioGroup: RadioGroup,
  CheckboxGroup: CheckboxGroup,
  Slider: Slider,
  Range: Range,
  Button: Button,
  Back: Back,
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FormityProvider components={components}>
      <App />
    </FormityProvider>
  </React.StrictMode>
);
```

You can define as many components as you want but the form fields need to meet certain requirements. This library uses [react-hook-form](https://www.npmjs.com/package/react-hook-form) under the hood and a form context is provided. For that reason you need to make sure that your form fields are registered to this form, like so:

```js
import { useFormContext } from 'react-hook-form';

function Input({ name, label, placeholder }) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name];
  return (
    <div>
      <label className="label">{label}</label>
      <div>
        <input
          {...register(name)}
          type="text"
          placeholder={placeholder}
          className={`input ${error ? 'error' : ''}`}
        />
      </div>
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}
```

You can take a look at the components of the example to give you a better idea about how these components can be defined. These are creatd using [radix-ui](https://www.radix-ui.com/) and you can reuse them and modify them as you want.
