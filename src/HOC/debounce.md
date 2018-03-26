`Debounce` is an HOC that enhances many FormFields in order to provide support for debounced `onChange` callback. It can be used as a component directly:

```js
<Debounce.Debounce
  value={state.value}
  debounce={1000}
  onChange={(v) => setState({ value: v })}
  render={(value, onChange) => (
    <p>
      <input
        placeholder="Type here..."
        value={value}
        onChange={(ev) => onChange(ev.target.value)}
      />
      <br />
      {<small>Debounced value: {state.value}</small>}
    </p>
  )}
/>
```

It can work stateless, by providing `holdValue` prop:

```js
<Debounce.Debounce
  debounce={1000}
  holdValue
  render={(value, onChange) => (
    <input
      placeholder="Type won't clear on render..."
      value={value}
      onChange={(ev) => onChange(ev.target.value)}
    />
  )}
/>
```

It can even be used as an enhancer:

```js static
const options = {
  valueProp: 'value', // default
};

const MyComponentDebounced = withDebounce(MyComponent, options);
```


