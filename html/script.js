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
            let isInput = item.input;
            let isForm = item.isForm;
            images[index] = item;
            
            if (isForm) {
                html += `<div class="form-container" id="${index}">
                    ${item.inputs.map(input => {
                        if (input.type === 'radio') {
                            return `
                                <div class="radio-inputs">
                                    ${input.options.map(option => `
                                        <label class="radio-button">
                                            <input type="radio" name="${input.name}" value="${option.value}" ${option.checked ? 'checked' : ''}>
                                            <div class="radio-circle"></div>
                                            <span class="radio-label">${option.label}</span>
                                        </label>
                                    `).join('')}
                                </div>
                            `;
                        } else {
                            return `
                                <div class="form-input">
                                    <label>${input.label}</label>
                                    <input type="${input.type}" placeholder="${input.placeholder || ''}" name="${input.name}">
                                </div>
                            `;
                        }
                    }).join('')}
                    <button class="form-submit">Submit</button>
                </div>`;
            } else if (isInput) {
                html += `<div class="input" id="${index}">
                    <div class="input-container">
                        <input type="text" placeholder="${message || 'Enter a value...'}" />
                    </div>
                    <button class="send-button">SEND</button>
                </div>`;
            } else {
                html += `<div style="--order: ${index}" ${getButtonRender(header, message, index, isMenuHeader, isDisabled, icon)}</div>`;
            }
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

    $('.form-submit').click(function() {
        const $form = $(this).closest('.form-container');
        const formData = {};
        
        // Radio buttonların değerlerini topla
        $form.find('input[type="radio"]:checked').each(function() {
            formData[this.name] = this.value;
        });
        
        // Normal inputların değerlerini topla
        $form.find('input[type="text"]').each(function() {
            formData[this.name] = this.value;
        });

        const id = $form.attr('id');
        if (Object.keys(formData).length > 0) {
            $.post(`https://${GetParentResourceName()}/formData`, JSON.stringify({
                id: parseInt(id) + 1,
                data: formData
            }));
            closeMenu();
        }
    });

    // Mevcut input işleyicileri
    function sendInputData($input) {
        const inputValue = $input.val();
        const id = $input.closest('.input').attr('id');
        if (inputValue.length > 0) {
            $.post(`https://${GetParentResourceName()}/inputData`, JSON.stringify({
                id: parseInt(id) + 1,
                value: inputValue
            }));
            closeMenu();
        }
    }

    $('.input input').on('keyup', function(e) {
        if (e.key === 'Enter') {
            sendInputData($(this));
        }
    });

    $('.send-button').click(function() {
        const $input = $(this).siblings('.input-container').find('input');
        sendInputData($input);
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
        case "SHOW_SEARCH":
            $('.search-container').show();
            $('#searchInput').focus();
            return;
        case "HIDE_SEARCH":
            $('.search-container').hide();
            return;
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
