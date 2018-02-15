The default exported component is enhanced with [Debounce](#debounce) and [Validation](#validation), so it inherits additional props to the above ones.

Default style

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label"
  options={[
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
    { label: 'Four', value: 4 },
    { label: 'Five', value: 5 },
    { label: 'Six', value: 6 },
    { label: 'Seven', value: 7 },
    { label: 'Eight', value: 8 },
    { label: '9', value: 9 },
    { label: 'Ten', value: 10 },
    { label: 'Eleven', value: 11 },
  ]}
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block level label, custom placeholder, optionsPerRow

```js
<FormFieldSelectGroup
  className="FormField--block"
  name={state.uid}
  label="Label:"
  placeholder="Any number"
  options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
  optionsPerRow={2}
/>
```

Invalid, inline, hidden placeholder

```js
<div>
  <FormFieldSelectGroup
    className="FormField--inline"
    name={state.uid}
    label="Label"
    hidePlaceholder
    options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]}
    touched
    validation={v => !v && 'Required'}
  />
  <span>{' \u00A0 '}</span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled, no label, value set and custom render

```js
<FormFieldSelectGroup
  name={state.uid}
  disabled
  options={[{ label: 'One', value: 1 }]}
  value={1}
  valueRenderer={opt => 'Nr. ' + opt.label}
/>
```

Read-only, value set

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label"
  readOnly
  options={[{ label: 'One', value: 1 }]}
  value={1}
/>
```

Inline, optionsPerRow

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label"
  inline
  optionsPerRow={3}
  options={[
    { label: 'One', value: 1 },
    { label: 'Two', value: 2 },
    { label: 'Three', value: 3 },
    { label: 'Four', value: 4 },
  ]}
/>
```

Inline, multiple, invalid, hide placeholder

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label:"
  hidePlaceholder
  inline
  multiple
  value={[1]}
  options={[
    { label: 'One', value: 1 },
    { label: 'Two has a long label that push', value: 2 },
    { label: 'Three', value: 3 },
  ]}
  touched
  validation={v => v.length < 2 && 'Please select two options'}
/>
```

Inline, zero optionsPerRow, block label, disabled

```js
<FormFieldSelectGroup
  className="FormField--block"
  name={state.uid}
  label="Label:"
  placeholder="Any number"
  inline
  optionsPerRow={0}
  options={[{ label: 'One', value: 1 }]}
  disabled
/>
```

Inline, read-only

```js
<FormFieldSelectGroup
  name={state.uid}
  inline
  readOnly
  label="Label"
  options={[{ label: 'One', value: 1 }]}
  value={1}
/>
```

Inline tabbed

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label:"
  placeholder="Any number"
  inline="tabbed"
  options={[{ label: '1 One', value: 1 }, { label: '2', value: 2 }]}
/>
```

Inline tabbed, block label, hide placeholder

```js
<FormFieldSelectGroup
  className="FormField--block"
  name={state.uid}
  label="Label:"
  hidePlaceholder
  inline="tabbed"
  options={[
    { label: 'One', value: 1 },
    { label: '2', value: 2 },
    { label: 'Three or three', value: 3 },
    { label: 'Four', value: 4 },
  ]}
/>
```

Inline tabbed disabled, no label

```js
<FormFieldSelectGroup
  name={state.uid}
  placeholder="Any number"
  inline="tabbed"
  disabled
  options={[{ label: '1 One', value: 1 }, { label: '2', value: 2 }]}
/>
```

Inline tabbed read-only

```js
<FormFieldSelectGroup
  name={state.uid}
  label="Label"
  placeholder="Any number"
  inline="tabbed"
  readOnly
  options={[{ label: '1 One', value: 1 }, { label: '2', value: 2 }]}
/>
```
