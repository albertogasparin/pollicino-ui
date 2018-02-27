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

Other positions, no modal overlay

```js
<Dropdown
  label="Locked dropdown aligned bottom left"
  align="left"
  opened
  modal={false}
>
  I'm bottom left
</Dropdown>
```

```js
<Dropdown
  label="Locked dropdown aligned top"
  align="top"
  opened
  modal={false}
>
  I'm top right
</Dropdown>
```

```js
<Dropdown
  label="Locked dropdown aligned top left"
  align="top left"
  opened
  modal={false}
>
  I'm top left
</Dropdown>
```

No arrow

```js
<Dropdown
  className="Dropdown--noArrow"
  label="Click to open with a really long long long long long label"
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
