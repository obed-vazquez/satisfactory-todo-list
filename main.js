// Lee el archivo de texto y genera la lista de tareas en el DOM
fetch('todo-list.txt')
  .then(response => response.text())
  .then(text => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    const rootUl = document.createElement('ul');
    rootUl.className = 'todo-list';
    let stack = [{indent: -1, ul: rootUl}];
    lines.forEach(line => {
      const match = line.match(/^(\s*)([+\-]?)(.*)$/);
      const indent = match[1].length;
      const status = match[2];
      const completed = status === '+';
      const inProgress = status === '-';
      const label = match[3].trim();
      const li = document.createElement('li');
      li.className = 'todo-item' + (completed ? ' completed' : inProgress ? ' in-progress' : '');
      let checkboxHtml = '';
      if (completed) {
        checkboxHtml = `<input type="checkbox" checked><span class="checkbox-box"></span>`;
      } else if (inProgress) {
        checkboxHtml = `<span class="checkbox-box checkbox-minusbox"><span class="checkbox-minus-symbol">-</span></span>`;
      } else {
        checkboxHtml = `<input type="checkbox"><span class="checkbox-box"></span>`;
      }
      // Reemplaza cada '!' en el texto por el icono de advertencia
      // const labelWithWarning = label.replace(/!/g, '<span class="warning-icon" title="¡Atención!">&#9888;</span>');
      // Aplica color naranja inline si es inProgress (tiene '-')
      let textStyle = '';
      let textClass = 'checkbox-label';
      if (completed) {
        textClass += ' completed-text';
      } else if (inProgress) {
        textStyle = ' style="color: var(--color-primary, #E39F61);"';
      }
      li.innerHTML = `<label class="custom-checkbox">
        ${checkboxHtml}
        <span class="${textClass}"${textStyle}>${labelWithWarning}</span>
      </label>`;
      // Encuentra el nivel correcto en la pila
      while (stack.length > 1 && indent <= stack[stack.length-1].indent) {
        stack.pop();
      }
      stack[stack.length-1].ul.appendChild(li);
      // Si la siguiente línea es más indentada, crea un nuevo ul
      if (lines[lines.indexOf(line) + 1] && lines[lines.indexOf(line) + 1].match(/^(\s*)/)[1].length > indent) {
        stack.push({indent, ul: li.appendChild(document.createElement('ul'))});
      }
    });
    // Elimina uls vacíos
    rootUl.querySelectorAll('ul').forEach(ul => { if (!ul.children.length) ul.remove(); });
    // Reemplaza la lista en el DOM
    const container = document.querySelector('.todo-list');
    if (container) container.replaceWith(rootUl);
  })
  .catch(error => console.error('Error al cargar la lista de tareas:', error));
