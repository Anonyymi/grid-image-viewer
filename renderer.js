(async () => {
    window.FIGURE_SIZE = 25

    const dir = await window.API.openDirectory()
    if (dir === undefined) {
        await window.API.exit()
        return
    }

    const files = await window.API.getFilesInDirectory({ dir: dir })
    const images = files.filter((file) => ['.png', '.jpg', '.gif'].some(ext => file.endsWith(ext)))

    const setup_anim = () => {
        const e_pv_container = document.getElementById('pv-container')
        e_pv_container.style.animation = `scroller ${images.length * 5}s linear infinite`
    }

    const load_images = () => {
        let images_shuffled = images
            .map(value => ({ value, sort: Math.random() }))
            .sort((a, b) => a.sort - b.sort)
            .map(({ value }) => value)

        const e_pv_container = document.getElementById('pv-container')

        const e_fragment = document.createDocumentFragment()
        for (const image of images_shuffled) {
            const e_figure = document.createElement('figure')
            e_figure.classList.add('pv-item')
            e_figure.style.width = window.FIGURE_SIZE + '%'
            e_figure.style.height = window.FIGURE_SIZE + '%'
            const e_img = document.createElement('img')
            e_img.classList.add('pv-image')
            e_img.src = 'file://' + dir + '/' + image
            e_figure.appendChild(e_img)
            e_fragment.appendChild(e_figure)
        }

        e_pv_container.replaceChildren(...e_fragment.childNodes)
    }

    load_images()
    setTimeout(setup_anim, 1000)

    document.addEventListener('keydown', (event) => {
        if (event.keyCode === 32) {
            load_images()
        }
    })

    document.addEventListener('wheel', (event) => {
        if (event.deltaY > 0) {
            window.FIGURE_SIZE -= 1
        } else if (event.deltaY < 0) {
            window.FIGURE_SIZE += 1
        }

        const e_figures = document.getElementsByClassName('pv-item')
        Array.from(e_figures).forEach((e_figure) => {
            e_figure.style.width = window.FIGURE_SIZE + '%'
            e_figure.style.height = window.FIGURE_SIZE + '%'
        })
    })
})()
