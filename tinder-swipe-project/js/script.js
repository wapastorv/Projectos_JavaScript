
const DESICIION_THRESHOLD = 75;

let isAnimating = false;
let pullDeltaX = 0;

function startDrag (event){
    if(isAnimating) return

    //get the pirst articule element
    const actualCard = event.target.closest('article')
    if(!actualCard) return

    //get the initial position of the mouse
    const startX=event.pageX ?? event.touches[0].pageX  //event.pageX is the position of the mouse in the X axis

    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onEnd)

    document.addEventListener('touchmove', onMove, {passive: true})
    document.addEventListener('touchend', onEnd, {passive: true})
    
    function onMove(event){
        //current position of the mouse
        const currentX = event.pageX ?? event.touches[0].pageX
        // The distance between the initial position and the current position
        pullDeltaX = currentX - startX

        //no hay distancia recorrida
        if(pullDeltaX === 0) return

        isAnimating = true
        //calculate the rotation of the card using the distance
        const deg = pullDeltaX / 14
        //apply the transformation to the card
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`
        //change the cursor to grabbing
        actualCard.style.cursor = 'grabbing'

        const opacity = Math.abs(pullDeltaX) / 100
        const isRight = pullDeltaX > 0

        const choiceEl = isRight
            ? actualCard.querySelector('.choice.like')
            : actualCard.querySelector('.choice.nope')
        
        choiceEl.style.opacity = opacity
    }
    function onEnd(event){
        //remove the event listeners
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        // saber si el usuario tomo la decisión de like o nope
        const decisionMade = Math.abs(pullDeltaX) >= DESICIION_THRESHOLD

        if(decisionMade){
            const goRight = pullDeltaX >= 0
            const goLeft = !goRight

            //add class acording to the decision
            actualCard.classList.add(goRight ? 'go-right' : 'go-left')
            //remove the class after the animation
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove()
                
            },)


        }else{
            actualCard.classList.add('reset')
            actualCard.classList.remove('go-right', 'go-left')

            actualCard.querySelectorAll('.choice').forEach(choice => {
                choice.style.opacity = 0
            });

        }

        //reset the values
        actualCard.addEventListener('transitionend', () => {
            
            actualCard.removeAttribute('style')
            actualCard.classList.remove('reset')

            pullDeltaX = 0
            isAnimating = false
            
        })
    }
}



document.addEventListener('mousedown', startDrag)
document.addEventListener('touchstart', startDrag, {passive: true})

