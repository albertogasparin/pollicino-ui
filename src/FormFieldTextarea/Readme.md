Default style

```js
<FormFieldTextarea
  name={state.uid}
  label="Label"
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block, custom placeholder

```js
<FormFieldTextarea
  className="FormField--block"
  name={state.uid}
  label="Label"
  placeholder="Type something..."
/>
```

Invalid, inline, custom size

```js
<div>
  <FormFieldTextarea
    className="FormField--inline"
    name={state.uid}
    value=""
    label="Label"
    rows="2"
    cols="14"
    touched
    validation={v => !v && 'Please provide a value'}
  />
  <span> &nbsp; </span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldTextarea
  name={state.uid}
  value="text\ntext\ntext\ntext\ntext"
  disabled
/>
```

Read-only

```js
<FormFieldTextarea name={state.uid} value="text\ntext\ntext\ntext" readOnly />
```
