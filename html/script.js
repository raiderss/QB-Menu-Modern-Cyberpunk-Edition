let buttonParams = [];
let images = [];

const openMenu = (data = null) => {
    let html = "";
    data.forEach((item, index) => {
        if(!item.hidden) {
            let header = item.header;
            let message = item.txt || item.text;
            let isMenuHeader = item.isMenuHeader;
            let isDisabled = item.disabled;
            let icon = item.icon;
            images[index] = item;
            html += `<div style="--order: ${index}" ${getButtonRender(header, message, index, isMenuHeader, isDisabled, icon)}</div>`;
            if (item.params) buttonParams[index] = item.params;
        }
    });

    $("#buttons").html(html);
    
    // Eğer 5'ten fazla buton varsa arama kutusunu göster
    const buttonCount = $('.button').length;
    if (buttonCount > 5) {
        $('.search-container').show();
        initializeSearch();
    } else {
        $('.search-container').hide();
    }

    $('.button').click(function() {
        const target = $(this)
        if (!target.hasClass('title') && !target.hasClass('disabled')) {
            postData(target.attr('id'));
        }
    });
};

const getButtonRender = (header, message = null, id, isMenuHeader, isDisabled, icon) => {
    return `
        <div class="${isMenuHeader ? "title" : "button"} ${isDisabled ? "disabled" : ""}" id="${id}">
            <div class="icon"> <img src=${icon} width=30px onerror="this.onerror=null; this.remove();"> <i class="${icon}" onerror="this.onerror=null; this.remove();"></i> </div>
            <div class="column">
            <div class="header"> ${header}</div>
            ${message ? `<div class="text">${message}</div>` : ""}
            </div>
        </div>
    `;
};

function initializeSearch() {
    const searchInput = $('#searchInput');
    
    searchInput.on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        
        $('.button').each(function() {
            const $button = $(this);
            const headerText = $button.find('.header').text().toLowerCase();
            const messageText = $button.find('.text').text().toLowerCase();
            
            if (headerText.includes(searchTerm) || messageText.includes(searchTerm)) {
                $button.removeClass('hidden').addClass('visible');
            } else {
                $button.removeClass('visible').addClass('hidden');
            }
        });
    });

    // Arama kutusunu temizleme
    searchInput.val('');
}

const closeMenu = () => {
    $("#buttons").html(" ");
    $('#imageHover').css('display' , 'none');
    $('.search-container').hide();
    buttonParams = [];
    images = [];
};

const postData = (id) => {
    $.post(`https://${GetParentResourceName()}/clickedButton`, JSON.stringify(parseInt(id) + 1));
    return closeMenu();
};

const cancelMenu = () => {
    $.post(`https://${GetParentResourceName()}/closeMenu`);
    return closeMenu();
};



window.addEventListener("message", (event) => {
    const data = event.data;
    const buttons = data.data;
    const action = data.action;
    switch (action) {
        case "OPEN_MENU":
        case "SHOW_HEADER":
            return openMenu(buttons);
        case "CLOSE_MENU":
            return closeMenu();
        default:
            return;
    }
});

window.addEventListener('mousemove', (event) => {
    let $target = $(event.target);
    if ($target.closest('.button:hover').length && $('.button').is(":visible")) {
        let id = event.target.id;
        if (!images[id]) return
        if (images[id].image) {
            $('#image').attr('src', images[id].image);
            $('#imageHover').css('display' , 'block');
        }
    }
    else {
        $('#imageHover').css('display' , 'none');
    }
})

document.onkeyup = function (event) {
    const charCode = event.key;
    if (charCode == "Escape") {
        cancelMenu();
    }
};
