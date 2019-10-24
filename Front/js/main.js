//----------------------------------------------------------
function getPosts() {
    let listPosts = [];
    $.ajax({
        url: '/api/blog-posts',
        method: 'GET'
    }).done((result) => {
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
        publishDate: new Date(),
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
$('#modalAdd').on('click', () => {
    $('#Date').val(new Date().toJSON().slice(0,10));
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
            '<h6>'+ date.toLocaleTimeString() + " "+ date.toDateString() +'</h6>' +
            '</div>'+
            '<p>'+ post.content +'</p>'+
            '<div class="Buttons">' +
            '<button id="Edit" type="button" class="btn btn-primary">EDIT</button>'+
            '<button id="Delete" type="button" class="btn btn-danger" onclick="deletePost(\''+ post.id + '\')">DELETE</button>'+
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
function _dissmissAlert() {
    $(".alert").fadeTo(2000, 500).slideUp(500, function(){
        $(".alert").slideUp(500);
        $('.AlertContainter').empty();
    });
}

getPosts();
