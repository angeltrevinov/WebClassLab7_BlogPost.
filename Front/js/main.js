let arrPosts = [];

//----------------------------------------------------------
function getPosts() {
    let listPosts = [];
    $.ajax({
        url: '/api/blog-posts',
        method: 'GET'
    }).done((result) => {
        console.log(result);
        arrPosts = result;
        listPosts = _preparePosts(result);
        $('#ListOfPosts').append(listPosts);
    });
}

//----------------------------------------------------------
$('#SearchAuthor').on('submit', (event) => {
    event.preventDefault();
    let authorToSearch = $('Input').val();
    $('#ListOfPosts').empty();
    $.ajax({
        url: '/api/blog-post?author=' + authorToSearch,
        method: 'GET'
    }).done((result) => {
        $('#ListOfPosts').append(_preparePosts(result));
    }).fail((error)  => {
        addAlert(
            error.status + " " + error.responseJSON.error,
            'danger'
        );
    });
});

//----------------------------------------------------------
function deletePost(postId) {
    $.ajax({
        url: '/api/blog-posts/' + postId,
        method: 'DELETE'
    }).done((result) => {
        addAlert(result.message, 'success');
        $('#ListOfPosts').empty();
        getPosts();
    }).fail((error) => {
        addAlert(
            error.status + " " + error.responseJSON.error,
            'danger'
        );
    });
}

//----------------------------------------------------------
function addPost() {

    let newPost = {
        title: $('#Title').val(),
        content: $('#Content').val(),
        author: $('#Author').val(),
        publishDate: $('#Date').val(),
    };

    $.ajax({
        url: '/api/blog-posts',
        method: 'POST',
        data: newPost
    }).done((result) => {
        addAlert(result.message, 'success');
        $('#AddModal').modal('hide');
        $('#ListOfPosts').empty();
        getPosts();
    }).fail((error) =>  {
        addAlert(
            error.status + " " + error.responseJSON.error,
            'danger'
        );
    });

}

//----------------------------------------------------------
function editPost(postId) {

    let Post = {
        id: postId,
        title: $('#Title').val(),
        content: $('#Content').val(),
        author: $('#Author').val(),
        publishDate: $('#Date').val(),
    };

    $.ajax({
        url: '/api/blog-posts/' + postId,
        method: 'PUT',
        data: Post
    }).done((result) => {
        addAlert(result.message, 'success');
        $('#AddModal').modal('hide');
        $('#ListOfPosts').empty();
        getPosts();
    }).fail((error) =>  {
        addAlert(
            error.status + " " + error.responseJSON.error,
            'danger'
        );
    });
}

//----------------------------------------------------------
function onEditPost(postId) {

    $('#ModalFooter').append(
        '<button type="button" class="btn btn-primary" onclick="editPost(\''+ postId + '\')">Edit Post</button>'
    );

    let post = arrPosts.find((post) => {
        return post.id === postId;
    });

    $('#Title').val(post.title);
    $('#Content').val(post.content);
    $('#Author').val(post.author);

    var local = new Date(post.publishDate);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    local.toJSON().slice(0,10);
    $('#Date').val(local.toJSON().slice(0,10));

}

//----------------------------------------------------------
$('#modalAdd').on('click', () => {
    var local = new Date();
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    local.toJSON().slice(0,10);
    $('#Date').val(local.toJSON().slice(0,10));

    $('#ModalFooter').append(
        '<button type="button" class="btn btn-primary" onclick="addPost()">Add Post</button>'
    );
});

//----------------------------------------------------------
$('#ListOfPosts').on('click', '#Edit', () => {
    $('#ModalTitle').empty();
    $('#ModalTitle')[0].innerHTML = 'Modify Post!'
});

//----------------------------------------------------------
function _preparePosts(posts) {
    let arrPosts = [];
    for(let post of posts) {
        let date = new Date(post.publishDate);
        arrPosts.push(
            '<div class="card">' +
            '<div class="card-body">' +
            '<h4 class="card-title">'+ post.title+'</h4>' +
            '<div class="card-subtitle mb-2 text-muted">' +
            '<h6>'+ post.author +'</h6>' +
            '<h6>'+ date.toLocaleTimeString() + " "+ date.toLocaleDateString() +'</h6>' +
            '</div>'+
            '<p>'+ post.content +'</p>'+
            '<div class="Buttons">' +
            '<button id="Edit" type="button" class="btn btn-primary" onclick="onEditPost(\''+ post._id + '\')" data-toggle="modal" data-target="#AddModal">EDIT</button>'+
            '<button id="Delete" type="button" class="btn btn-danger" onclick="deletePost(\''+ post._id + '\')">DELETE</button>'+
            '</div>'+
            '</div>' +
            '</div>'
        );
    }
    return arrPosts;
}

//----------------------------------------------------------
function addAlert(strMessage, strType) {
    $('.AlertContainter').append(
        '<div class="alert alert-'+ strType +'" role="alert">' +
        strMessage +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '    <span aria-hidden="true">&times;</span>' +
        '  </button>'+
        '</div>'
    );
    _dissmissAlert();
}

//----------------------------------------------------------
$('#AddModal').on('hidden.bs.modal', () => {
    _emptyFormFields();
});

//----------------------------------------------------------
function _dissmissAlert() {
    $(".alert").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert").slideUp(500);
        $('.AlertContainter').empty();
    });
}

//----------------------------------------------------------
function _emptyFormFields() {
    $('#Title').val("");
    $('#Content').val("");
    $('#Author').val("");
    $('#Date').val("");
    $('#ModalFooter')[0].childNodes[3].remove();
}

getPosts();
