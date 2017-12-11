Default style with label

```js
<Collapsible
  header="Title"
  onCollapse={() => setState({ collapsed: true })}
  onExpand={() => setState({ collapsed: false })}
>
  <div className="dark">
    Content<br />Content<br />Content<br />Content
  </div>
</Collapsible>
```

Expanded, header element clickable

```js
<Collapsible
  header={<i>Title</i>}
  expanded
  headerClickable
>
  <p>Content</p>
</Collapsible>
```

Disabled with reversed chevron direction

```js
<Collapsible disabled header="Search" direction="up">
  <p>Content</p>
</Collapsible>
```
