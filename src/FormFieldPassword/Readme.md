Default style

```js
<FormFieldPassword
  name={state.uid}
  label="Label"
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block, custom placeholder

```js
<FormFieldPassword
  name={state.uid}
  className="FormField--block"
  label="Label:"
  placeholder="Type your password..."
/>
```

Invalid, inline, custom size

```js
<div>
  <FormFieldPassword
    name={state.uid}
    className="FormField--inline"
    value="12345"
    label="Label"
    size="14"
    touched
    validation={v =>
      v.length < 6 && 'Your password should be at least 6 chars long'
    }
  />
  <span> &nbsp; </span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldPassword name={state.uid} value="password" disabled />
```

Read-only

```js
<FormFieldPassword name={state.uid} value="password" readOnly />
```
