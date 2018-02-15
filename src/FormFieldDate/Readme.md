The default exported component is enhanced with [Debounce](#debounce) and [Validation](#validation), so it inherits additional props to the above ones.

Default style (single) with options

```js
<FormFieldDate
  label="Label"
  options={[
    { label: '1990', value: '1990-01-01' },
    { label: '2000', value: '2000-01-01' },
  ]}
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Default style (range), block, no options/placeholder

```js
<FormFieldDate
  className="FormField--block"
  label="Label:"
  isRange
  hidePlaceholder
/>
```

Default style (single), Min/max date, year dropdown

```js
<FormFieldDate
  label="Label"
  yearDropdown
  minDate={new Date('2000-01-01')}
  maxDate={new Date()}
/>
```

Invalid, inline

```js
<div>
  <FormFieldDate
    className="FormField--inline"
    label="Label"
    placeholder="Please select a date"
    touched
    validation={v => !v && 'Required'}
  />
  <span>{' \u00A0 '}</span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled, no label, value set

```js
<FormFieldDate
  disabled
  options={[{ label: '1990/91', value: ['1990-01-01', '1991-01-01'] }]}
  value={['1990-01-01', '1991-01-01']}
/>
```

Read-only

```js
<FormFieldDate label="Label" readOnly value={['1990-01-01', '1991-01-01']} />
```
