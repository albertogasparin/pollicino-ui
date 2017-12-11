Default style

```js
<FormFieldColor
  label="Label"
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block level label, defaultValue, opacity

```js
<FormFieldColor
  className="FormField--block"
  label="Label:"
  defaultValue="rgba(255,100,0,0.5)"
  opacity
/>
```

Invalid, inline

```js
<div>
  <FormFieldColor
    className="FormField--inline"
    touched
    label="Label"
    validation={v => v === 'rgba(0,0,0,1)' && 'Black\u00A0not\u00A0allowed'}
  />
  <span> &nbsp; </span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

No options but disabled

```js
<FormFieldColor disabled />
```

Read-only

```js
<FormFieldColor readOnly />
```
