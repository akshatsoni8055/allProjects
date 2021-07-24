$(document).ready(function () {

    $("#but_upload").click(function () {

        var fd = new FormData();
        var files = $('#file')[0].files;
        var person = document.getElementById('person').value
        var isWorking = false
        // Check file selected or not
        if (files.length > 0 && person.trim() !== "" && !isWorking) {
            document.getElementById('but_upload').value = '...Uploading'
            document.getElementById('data').style.visibility = 'hidden'
            for (let i = 0; i < files.length; i++) {
                isWorking = true
                fd.append('files', files[i])
            }
            fd.append('person', person)

            $.ajax({
                url: '/hbd/upload',
                type: 'post',
                data: fd,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response) {
                        isWorking = false
                        document.getElementById('but_upload').value = 'Upload'
                        document.getElementById('data').style.visibility = 'visible'
                        document.getElementById('myinput').value = response.link
                        document.getElementById('whatsapp').href = `https://api.whatsapp.com/send?text=${response.link}`
                    } else {
                        alert('file not uploaded');
                    }
                },
            });
        } else {
            alert("Please select a file.");
        }
    });
});
function copytoclip() {
    var copyText = document.getElementById("myinput");
    copyText.select();
    document.execCommand("copy");
    copyText.blur();
    alert("Url has been copyied to clipboard");
}