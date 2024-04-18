function ToolBar() {
  return (
    <div className="toolBarContainer">
      <div id="toolbar">
        <span>
          <button className="button ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>

        <span>
          <button className="ql-align" value=""></button>
          <button className="ql-align" value="center"></button>
          <button className="ql-align" value="right"></button>
          <button className="ql-align" value="justify"></button>
        </span>

        <select class="ql-header">
          <option value="1">h1</option>
          <option value="2">h2</option>
          <option value="3">h3</option>
        </select>

        <button className="ql-clean"></button>
      </div>
    </div>
  );
}

export default ToolBar;
