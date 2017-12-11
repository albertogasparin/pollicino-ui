Default style

```js
<FormFieldText
  name={state.uid}
  label="Label"
  value={state.value}
  onChange={v => setState({ value: v })}
/>
```

Block, custom placeholder, icon right

```js
<FormFieldText
  className="FormField--block"
  name={state.uid}
  label="Label:"
  placeholder="Type something..."
  iconRight={
    <Btn className="Btn--square Btn--primary">
      <Icon glyph="magnify" />
    </Btn>
  }
/>
```

Invalid, inline, custom size, icon left

```js
<div>
  <FormFieldText
    className="FormField--inline"
    name={state.uid}
    label="Label"
    value=""
    size="14"
    iconLeft={<Icon glyph="magnify" />}
    touched
    validation={v => v.length < 3 && 'Write at least 3 chars'}
  />
  <span>&nbsp; </span>
  <Btn className="Btn--primary" disabled>
    next
  </Btn>
</div>
```

Disabled

```js
<FormFieldText
  name={state.uid}
  value="text"
  disabled
/>
```

Read-only

```js
<FormFieldText
  name={state.uid}
  value="text"
  readOnly
/>
```
