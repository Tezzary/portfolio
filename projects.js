
for (let element of document.getElementsByClassName('project')) {
    element.addEventListener('click', function() {
        location.href = "/html/project.html?project=" + element.id;
    });
}