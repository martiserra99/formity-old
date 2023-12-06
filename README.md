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

To start using the library, you have to use the `FormityProvider` component to define the components that will be used by your form:

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

function TextField({ name, label, placeholder }) {
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
          className={`textField ${error ? 'error' : ''}`}
        />
      </div>
      {error && <p className="error">{error.message}</p>}
    </div>
  );
}

export default TextField;
```

You can take a look at the components of the example to give you a better idea about how these components can be defined. These are creatd using [radix-ui](https://www.radix-ui.com/) and you can reuse them and modify them as you want.

### Formity

Once you have provided these components using the `FormityProvider` component, you can start to create a form. To be able to do it you have to use the `Formity` component, and you have to provide a json that defines the form and a callback that will be called when the form is submitted:

```js
// ...

function App() {
  function handleSubmit(data) {
    console.log(data);
  }
  return (
    <Center>
      <Card>
        <Formity json={form} onSubmit={handleSubmit} />
      </Card>
    </Center>
  );
}

// ...
```

### Json

The json that defines the form has to be an array of elements that can be of different types. The type of elements that exist are:

- **form**: A step in the form.

- **return**: What the form returns.

- **variables**: Variables to use next.

- **cond**: Condition to define what to do.

- **loop**: Loop to define what to repeat.

#### form

The form element is an object with the following syntax:

```json
{ "form": "expression" }
```

`"expression"` has to be a mongu expression that has to resolve to an object with these properties:

```json
{
  "defaultValues": "...",
  "resolver": "...",
  "render": "..."
}
```

The `defaultValues` property defines the default values of the form, like so:

```json
{
  "defaultValues": {
    "name": "Marti",
    "age": 24
  }
  // ...
}
```

The `resolver` property defines the validations of the form, like so:

```json
{
  "resolver": {
    "name": [
      [{ "$ne": ["$name", ""] }, "Required"],
      [{ "$lt": [{ "$strLen": "$name" }, 20] }, "No more than 20 chars"]
    ]
  }
}
```

These validations are defined using mongu expressions that resolve to boolean values and error messages.

The `render` property defines the components that are rendered, like so:

```json
{
  "render": [
    {
      "LayoutForm": {
        "heading": "What is your name?",
        "text": "Fill in your name",
        "fields": [
          {
            "TextField": {
              "name": "name",
              "label": "Name",
              "placeholder": "Enter your name"
            }
          }
        ],
        "buttons": [
          {
            "Button": {
              "type": "submit",
              "children": "Next"
            }
          }
        ]
      }
    }
  ]
}
```

The components defined are the ones that are provided using the `FormityProvider` component. They have to start with a capital letter.
