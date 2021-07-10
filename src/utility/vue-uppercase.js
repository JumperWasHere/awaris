import Vue from 'vue'
const Uppercase = {
    twoWay: true,
    // TODO: unbind
    unbind: () => { },
    bind: function (el, binding, vnode) {
        const findVModelName = vnode => {
            try {
                // https://forum.vuejs.org/t/solved-how-can-you-update-the-v-model-from-a-custom-directive-in-vue-2/2275
                return vnode.data.directives.find(o => {
                    return o.name === "model";
                }).expression;
            } catch (error) {
                error.message = `Unable to find v-model directive at ${vnode.tag
                    } tag. Please specify the expression: v-uppercase='obj.prop'`;
                throw error;
            }
        };

        const funcByName = (functionName, context, value) => {
            // https://stackoverflow.com/a/359910/8801075
            var namespaces = functionName.split(".");
            var func = namespaces.pop();
            for (var i = 0; i < namespaces.length; i++)
                context = context[namespaces[i]];
            return (context[func] = value);
        };

        var expression = binding.expression ?
            binding.expression :
            findVModelName(vnode);
        vnode.context.$watch(expression, {
            //deep: true, // ?
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    return funcByName(
                        expression,
                        vnode.context,
                        newVal.toString().toLocaleUpperCase()
                    );
                }
            }
        });
    }
};

export default {
    Uppercase,
};

Vue.directive("uppercase", Uppercase);