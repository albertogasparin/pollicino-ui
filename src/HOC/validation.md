`Validation` is an HOC that enhances all FormFields in order to provide support for `value` validation following the UX patter: reward early, punish late. So, for most of the components, validation is triggered `onBlur` if the field is in neutral state and `onChange` if in error state. It can be used as a component directly:

```js
<Validation.Validation 
  value={state.value}
  validation={(v) => !/\d+/.test(v) && 'only numbers allowed'}
  onChange={(v) => setState({ value: v })}
  render={(value, onFocus, onBlur, onChange, error) => (
    <p>
      <input 
        placeholder="Type here..."
        value={value} 
        onFocus={onFocus} 
        onBlur={onBlur} 
        onChange={(ev) => onChange(ev.target.value)} 
      />
      <br />
      {error ? <small>Invalid input: {error}</small> : <small>{'\u00A0'}</small>}
    </p>
  )}
/>
```

Or as an enhancer:

```js static
const options = {
  valueProp: 'value', // default
  immediate: false, // default off, enables validate on change
};

const MyComponentValidated = withValidation(MyComponent, options);
```
