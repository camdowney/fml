# FML - Functional Markup Language
FML is a novel JS library that attempts to mash together the functionality of web components and React. It was developed as a side project for pure fun, and as such is incomplete and absolutely not to be used in production. It relies on template strings for creating components and stores data directly in the HTML it outputs, which results in a lot of weirdness.

The idea is that a single "generator" script makes all components accessible across the application, which can then be used in the following manner in plain HTML:

```
<f-example-component id='123'>
  <div>child</div>
</f-example-component>
```

The generator script may accordingly contain an exampleComponent function that will receive the props id = '123' and children = '&lt;div>child&lt;/div>'. Additionally, it will receive a uid prop given to it by the generator which may be used to access the component's state.