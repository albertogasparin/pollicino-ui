The default exported component is enhanced with [Debounce](#debounce) and [Validation](#validation), so it inherits additional props to the above ones.

Default style with min, max

```js
<FormFieldNumber
  name={state.uid}
  label="Label"
  min={-10}
  max={10}
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block level label, custom step, decimals

```js
<FormFieldNumber
  name={state.uid}
  className="FormField--block"
  label="Label:"
  step={0.1}
  value={1.234}
  decimals={3}
/>
```

Invalid, custom size

```js
<div>
  <FormFieldNumber
    name={state.uid}
    className="FormField--inline"
    label="Label"
    size="4"
    validation={v => (!v || v === 0) && 'Required'}
    touched
  />
  <span>{' \u00A0 '}</span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

No options but disabled

```js
<FormFieldNumber name={state.uid} value={100000} disabled />
```

No options but read-only

```js
<FormFieldNumber name={state.uid} value={100000} readOnly />
```
