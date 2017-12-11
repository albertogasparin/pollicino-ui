Default style, radiobox

```js
<div>
  <FormFieldTick
    name={state.uid}
    label="Label 1"
    value="1"
    onChange={v => setState({ value: v })}
  />
  <FormFieldTick
    name={state.uid}
    checked
    label="Label 2"
    value="2"
    onChange={v => setState({ value: v })}
  />
</div>
```

Default style, checkbox, invalid

```js
<div>
  <FormFieldTick
    name={state.uid + '0'}
    type="checkbox"
    label="Checked label"
    value="1"
    checked
  />
  <FormFieldTick
    name={state.uid}
    type="checkbox"
    label="Invalid loooooooong label"
    value="1"
    touched
    validation={checked => !checked && 'Please check this box'}
  />
</div>
```

Inline, disabled

```js
<div>
  <FormFieldTick
    className="FormField--inline"
    name={state.uid}
    label="Label"
    value=""
    disabled
  />
  <span> &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name={state.uid}
    label="Label"
    value=""
    checked
    disabled
  />
  <span> &nbsp; &nbsp; &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name={state.uid}
    label="Label"
    value=""
    type="checkbox"
    disabled
  />
  <span> &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name={state.uid}
    label="Label"
    value=""
    type="checkbox"
    checked
    disabled
  />
</div>
```

Inline, read-only

```js
<div>
  <FormFieldTick
    className="FormField--inline"
    name="ro1"
    label="Label"
    value=""
    readOnly
  />
  <span> &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name="ro2"
    label="Label"
    value=""
    checked
    readOnly
  />
  <span> &nbsp; &nbsp; &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name="ro3"
    label="Label"
    value=""
    type="checkbox"
    readOnly
  />
  <span> &nbsp; </span>
  <FormFieldTick
    className="FormField--inline"
    name="ro4"
    label="Label"
    value=""
    type="checkbox"
    checked
    readOnly
  />
</div>
```
