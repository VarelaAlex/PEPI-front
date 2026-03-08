import { useEffect } from 'react';

/**
 * Hook que bloquea el gesto de pull-to-refresh (swipe hacia abajo) en dispositivos táctiles
 * Pero permite el scroll normal en los componentes
 */
export const usePullToRefreshBlocker = () => {
    useEffect(() => {
        let lastY = 0;

        const handleTouchStart = (e) => {
            lastY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            const currentY = e.touches[0].clientY;
            const scrollElement = e.target;

            // Verificar si el elemento o su padre tienen scroll
            let element = scrollElement;
            let isScrollable = false;

            // Buscar el elemento scrolleable más cercano
            while (element && element !== document.body) {
                const scrollHeight = element.scrollHeight;
                const clientHeight = element.clientHeight;
                const scrollTop = element.scrollTop;

                // Si el elemento es scrolleable y estamos en la parte superior
                if (scrollHeight > clientHeight && scrollTop === 0 && currentY > lastY) {
                    // Es scroll hacia abajo en un elemento scrolleable en la parte superior
                    e.preventDefault();
                    break;
                }

                // Si el elemento es scrolleable pero no estamos en la parte superior, permitir scroll
                if (scrollHeight > clientHeight && scrollTop > 0) {
                    isScrollable = true;
                    break;
                }

                element = element.parentElement;
            }

            // Si llegamos a document.body y estamos en scroll hacia abajo en la parte superior
            if (element === document.body || !element) {
                const docScroll = document.documentElement.scrollTop;
                if (docScroll === 0 && currentY > lastY) {
                    e.preventDefault();
                }
            }

            lastY = currentY;
        };

        // Agregar event listeners con passive: false para permitir preventDefault
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchmove', handleTouchMove, { passive: false });

        // Cleanup
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);
};


