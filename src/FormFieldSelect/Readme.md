The default exported component is enhanced with [Debounce](#debounce) and [Validation](#validation), so it inherits additional props to the above ones.

Default style

```js
<FormFieldSelect
  name={state.uid}
  label="Label"
  options={[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]}
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Invalid, inline, custom placeholder

```js
<div>
  <FormFieldSelect
    className="FormField--inline"
    name={state.uid}
    label="Label"
    placeholder="Zero"
    options={[{ label: 'One', value: '1' }, { label: 'Two', value: '2' }]}
    touched
    validation={v => !v && 'Please\u00a0select an option'}
  />
  <span>{' \u00A0 '}</span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldSelect
  name={state.uid}
  options={[{ label: 'One', value: '1' }]}
  value={'1'}
  disabled
/>
```

Read-only

```js
<FormFieldSelect
  name={state.uid}
  options={[{ label: 'One', value: '1' }]}
  value={'1'}
  readOnly
/>
```
