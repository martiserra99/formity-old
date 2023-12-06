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
    <Theme panelBackground="translucent">
      <FormityProvider components={components}>
        <App />
      </FormityProvider>
    </Theme>
  </React.StrictMode>
);
```

You can define as many components as you want but the form fields need to meet certain requirements. This library uses [react-hook-form](https://www.npmjs.com/package/react-hook-form) under the hood and a form context is provided. For that reason you need to make sure that your form fields are registered to this form, like so:

```js
import { useFormContext } from 'react-hook-form';

// ...

function TextField({ label, name, placeholder }) {
  const { register, formState } = useFormContext();
  const error = formState.errors[name];
  return (
    <Text as="label" className={styles.label}>
      <Label as="div" mb="1" error={error}>
        {label}
      </Label>
      <RadixTextField.Input
        placeholder={placeholder}
        {...register(name)}
        {...(error && { color: 'red' })}
      />
      {error && <ErrorMessage mt="1">{error.message}</ErrorMessage>}
    </Text>
  );
}

// ...
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

`"expression"` is a mongu expression that has to resolve to an object with these properties:

```json
{
  "defaultValues": "...",
  "resolver": "...",
  "render": "..."
}
```

The `defaultValues` property defines the default values of the form:

```json
{
  "defaultValues": {
    "name": "Marti",
    "age": 24
  }
  // ...
}
```

The `resolver` property defines the validations of the form:

```json
{
  // ...
  "resolver": {
    "name": [
      [{ "$ne": ["$name", ""] }, "Required"],
      [{ "$lt": [{ "$strLen": "$name" }, 20] }, "No more than 20 chars"]
    ]
  }
  // ...
}
```

These validations are defined using mongu expressions (that resolve to boolean values) and error messages.

The `render` property defines the components that are rendered:

```json
{
  // ...
  "render": [
    {
      "LayoutForm": {
        "heading": "What is your name and age?",
        "text": "Fill in your name and select your age",
        "fields": [
          {
            "TextField": {
              "name": "name",
              "label": "Name",
              "placeholder": "Enter your name"
            }
          },
          {
            "Slider": {
              "name": "age",
              "label": "Age",
              "min": 1,
              "max": 100,
              "step": 1
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

This is an example:

```json
[
  {
    "form": {
      "defaultValues": {
        "name": "Marti",
        "age": 24
      },
      "resolver": {
        "name": [
          [{ "_$ne": ["_$name", ""] }, "Required"],
          [{ "_$lt": [{ "_$strLen": "_$name" }, 20] }, "No more than 20 chars"]
        ]
      },
      "render": [
        {
          "LayoutForm": {
            "heading": "What is your name and age?",
            "text": "Fill in your name and select your age",
            "fields": [
              {
                "TextField": {
                  "name": "name",
                  "label": "Name",
                  "placeholder": "Enter your name"
                }
              },
              {
                "Slider": {
                  "name": "age",
                  "label": "Age",
                  "min": 1,
                  "max": 100,
                  "step": 1
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
  },
  {
    "return": {
      "name": "$name",
      "age": "$age"
    }
  }
]
```

#### return

The return element is an object with the following syntax:

```json
{ "return": "expression" }
```

`"expression"` is a mongu expression that can resolve to any value.

This is an example:

```json
[
  {
    "form": {
      "defaultValues": {
        "name": "",
        "surname": ""
      },
      "resolver": {
        "name": [[{ "_$ne": ["_$name", ""] }, "Required"]],
        "surname": [[{ "_$ne": ["_$surname", ""] }, "Required"]]
      },
      "render": [
        {
          "LayoutForm": {
            "heading": "What is your name and surname?",
            "text": "Fill in your name and surname",
            "fields": [
              {
                "TextField": {
                  "name": "name",
                  "label": "Name",
                  "placeholder": "Enter your name"
                }
              },
              {
                "TextField": {
                  "name": "surname",
                  "label": "Surname",
                  "placeholder": "Enter your surname"
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
  },
  {
    "return": { "$concat": ["$name", " ", "$surname"] }
  }
]
```

#### variables

The variables element is an object with the following syntax:

```json
{ "variables": "expression" }
```

`"expression"` is a mongu expression that has to resolve to an object like this:

```json
{
  "variable_1": "value_1",
  "variable_2": "value_2",
  "...": "..."
}
```

The values of the variables can be of any type.

This is an example:

```json
[
  {
    "form": {
      "defaultValues": {
        "name": "",
        "surname": ""
      },
      "resolver": {
        "name": [[{ "_$ne": ["_$name", ""] }, "Required"]],
        "surname": [[{ "_$ne": ["_$surname", ""] }, "Required"]]
      },
      "render": [
        {
          "LayoutForm": {
            "heading": "What is your name and surname?",
            "text": "Fill in your name and surname",
            "fields": [
              {
                "TextField": {
                  "name": "name",
                  "label": "Name",
                  "placeholder": "Enter your name"
                }
              },
              {
                "TextField": {
                  "name": "surname",
                  "label": "Surname",
                  "placeholder": "Enter your surname"
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
  },
  {
    "variables": {
      "fullName": { "$concat": ["$name", " ", "$surname"] }
    }
  },
  {
    "return": "$fullName"
  }
]
```
