Default style

```js
<FormFieldRange
  name={state.uid}
  label="Label"
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block level label, min, max, step, value

```js
<FormFieldRange
  className="FormField--block"
  name={state.uid}
  label="Label:"
  min={5}
  max={10}
  step={0.5}
  value={7}
/>
```

Invalid, inline, custom size

```js
<div>
  <FormFieldRange
    className="FormField--inline"
    name={state.uid}
    label="Label"
    size="14"
    min={-5}
    max={5}
    step={1}
    touched
    validation={v => !v && 'Please select a non-zero value'}
  />
  <span> &nbsp; </span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldRange name={state.uid} disabled value={5} />
```

Read-only

```js
<FormFieldRange name={state.uid} readOnly value={5} />
```
