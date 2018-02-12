Primary with tooltip

```js
<Btn
  className="Btn--primary"
  data-tip="Tooltip"
  onClick={() => setState({ clicked: true })}
>
  I'm a primary button
</Btn>
```

Smaller with right tooltip

```js
<small>
  <Btn className="Btn--primary" data-tip="Tooltip right" data-tip-right={true}>
    Button 2
  </Btn>
</small>
```

Custom tagName, secondary and line

```js
<Btn tagName="a" href="javascript:" className="Btn--secondary Btn--line">
  Button long
</Btn>
```

Outline, square

```js
<div>
  <span style={{ color: '#E11' }}>
    <Btn className="Btn--outline Btn--square">
      <Icon glyph="magnify" />
    </Btn>
  </span>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <Btn className="Btn--square">
    <Icon glyph="magnify" />
  </Btn>
</div>
```

Loading

```js
<div>
  <Btn className="Btn--primary" loading data-tip="Tooltip">
    Button loading
  </Btn>
  <span>&nbsp;&nbsp;&nbsp;</span>
  <Btn className="Btn--outline Btn--square" loading>
    <Icon glyph="magnify" />
  </Btn>
</div>
```

Disabled

```js
<Btn className="Btn--primary" disabled>
  Button
</Btn>
```
