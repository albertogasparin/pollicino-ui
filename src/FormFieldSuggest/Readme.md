The default exported component is enhanced with [Debounce](#debounce) and [Validation](#validation), so it inherits additional props to the above ones.

Default style

```js
<FormFieldSuggest
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
  onChange={(v) => setState({ value: v })}
/>
```

Block level label, custom placeholder, async options

```js
<FormFieldSuggest
  className="FormField--block"
  name={state.uid}
  label="Label"
  placeholder="Select a user"
  valueKey="id"
  labelKey="login"
  loadOptions={(v) => {
    if (!v) {
      return Promise.resolve(null);
    }
    return window
      .fetch(`https://api.github.com/search/users?q=${v}`)
      .then((resp) => resp.json())
      .then((json) => {
        return json.items;
      });
  }}
/>
```

Invalid, inline, custom size, allowAny, labelKey, valueKey, rows, filter

```js
<div>
  <FormFieldSuggest
    className="FormField--inline"
    name={state.uid}
    value={{ lb: '12', vl: 12 }}
    labelKey="lb"
    valueKey="vl"
    allowAny
    rows="3.5"
    size="10"
    filterOptions={(opts, input) =>
      opts.filter(
        (o) => o.lb.includes(input) || String(o.vl).includes(input)
      )
    }
    options={[
      { lb: 'One', vl: 1 },
      { lb: 'Two', vl: 2 },
      { lb: 'Three', vl: 3 },
      { lb: 'Four', vl: 4 },
      { lb: 'Five', vl: 5 },
      { lb: 'Six', vl: 6 },
      { lb: 'Seven', vl: 7 },
      { lb: 'Eight', vl: 8 },
      { lb: '9', vl: 9 },
      { lb: 'Ten', vl: 10 },
      { lb: 'Eleven', vl: 11 },
    ]}
    touched
    validation={(o) => (!o || o.vl > 10) && 'Please chose a number < 10'}
  />
  <span>{' \u00A0 '}</span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldSuggest
  name={state.uid}
  disabled
  value={{ value: '', label: 'Value' }}
/>
```

Read-only

```js
<FormFieldSuggest
  name={state.uid}
  value={{ value: '', label: 'Value' }}
  readOnly
/>
```
