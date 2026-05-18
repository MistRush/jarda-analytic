import {computed} from "vue";

export function IconProps(defWidth = 16, defHeight = 16, loading = false){
    const props = {
        width: {
            type: [Number, String],
            default: undefined,
        },
        height: {
            type: [Number, String],
            default: undefined,
        },
        color: {
            type: String,
            default: undefined,
        },
        loading: {
            type: Boolean,
            default: loading,
        }
    };

    return props;
}

export function useIcon(props){
    const colors = {
        white: '#fff',
        black: '#152234',
        blue: '#0575E5',
        gray: '#9FBBCA',
        green: '#24C586',
        red: '#E82121',
        orange: '#EFAD1F',
    }

    const color = computed(() => {
        if(!props.color) {
            return null;
        }

        if(props.color.startsWith('#')){
            return props.color;
        }else{
            return colors[props.color] ?? colors.white;
        }
    });

    return {
        color,
    }
}