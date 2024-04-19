function ToolBar() {
  return (
    <div className="toolBarContainer">
      <div id="toolbar">
        <button className="ql-bold"></button>
        <button className="ql-italic"></button>
        <button className="ql-underline"></button>
        <button className="ql-strike"></button>

        <button className="ql-align" value=""></button>
        <button className="ql-align" value="center"></button>
        <button className="ql-align" value="right"></button>
        <button className="ql-align" value="justify"></button>

        <select class="ql-size">
          <option selected></option>
          <option value="huge">Heading1</option>
          <option value="large">Heading2</option>
          <option value="small">Small</option>
        </select>

        <button className="ql-blockquote"></button>
        <button className="ql-code-block"></button>

        <button className="ql-link"></button>
        <button className="ql-image"></button>

        <button className="ql-list" value="ordered"></button>
        <button className="ql-list" value="bullet"></button>

        <button className="ql-script" value="sub"></button>
        <button className="ql-script" value="super"></button>

        <select className="ql-color">
          <option value="red"></option>
          <option value="green"></option>
          <option value="blue"></option>
        </select>

        <button className="ql-clean"></button>
      </div>
    </div>
  );
}

export default ToolBar;
