Default style with label

```js
<Dropdown
  label="Click here to open the dropdown"
  onOpen={() => setState({ isOpen: true })}
  onClose={() => setState({ isOpen: false })}
>
  <p>
    Click here
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    <br />
    will not close
  </p>
</Dropdown>
```

Left, no modal overlay

```js
<Dropdown
  label="Locked dropdown with a really long long long long long label"
  align="left"
  autoClose
  opened
  modal={false}
>
  Cannot close this
</Dropdown>
```

No arrow

```js
<Dropdown
  className="Dropdown--noArrow"
  label="Click to open"
  align="left"
  autoClose
>
  Click anywhere to close
</Dropdown>
```

Disabled, custom label component

```js
<Dropdown disabled label={<Icon glyph="magnify" />} />
```
