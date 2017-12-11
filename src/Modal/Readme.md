Default style

```js
<Modal
  title="Title"
  message="Message"
  onClose={() => setState({ closed: true })}
/>
```

Custom title with icon and custom buttons

```js
<Modal
  title={<i>Error</i>}
  icon="alert"
  headerClassName="dark"
  message={
    <ul style={{ margin: 0, paddingLeft: '1.1em' }}>
      <li>A</li>
      <li>B</li>
    </ul>
  }
  buttons={[
    { label: 'One', action: () => setState({ clicked: 0 }) },
    {
      label: 'Two',
      className: 'Btn--primary',
      action: () => setState({ clicked: 1 }),
    },
  ]}
/>
```
