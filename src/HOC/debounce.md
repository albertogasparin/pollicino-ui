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
        value={value} onChange={(ev) => onChange(ev.target.value)} 
      />
      <br />
      {<small>Debounced value: {state.value}</small>}
    </p>
  )}
/>
```

Or as an enhancer:

```js static
const options = {
  valueProp: 'value', // default
};

const MyComponentDebounced = withDebounce(MyComponent, options);
```
