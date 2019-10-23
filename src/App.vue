<template>
  <div id="app">
    <div>
      <textarea v-model="code" style="width: 50%; height: 500px;"></textarea>
    </div>
    <div>
      <button @click="parseCode">Parse!</button>
    </div>
  </div>
</template>

<script>
import code from 'raw-loader!./data/code.txt';
import { parse } from '@babel/parser';

export default {
  name: 'App',
  data: () => ({
    code,
  }),
  methods: {
    parseCode() {
      const parsedCode = parse(this.code, { sourceType: 'module' });
      console.log(parsedCode);

      const exportDefaultNode = parsedCode.program.body.find(
        node => node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ObjectExpression',
      );

      if (!exportDefaultNode) {
        console.warn('Export default not found!');
        return;
      }

      let moduleNamespaced = false;

      exportDefaultNode.declaration.properties.forEach(property => {
        const propKeyType = property.key.type;
        if (propKeyType !== 'Identifier' && propKeyType !== 'StringLiteral') return;

        const propKey = propKeyType === 'Identifier' ? property.key.name : property.key.value;

        const propValueType = property.value.type;
        if (propValueType !== 'ObjectExpression' && propValueType !== 'BooleanLiteral') return;

        const propValue = propValueType === 'ObjectExpression' ? property.value.properties : property.value.value;

        if (propKey === 'namespaced' && propValue === true) {
          moduleNamespaced = true;
          return;
        }

        const moduleAllowedKeys = ['state', 'getters', 'actions', 'mutations'];
        if (moduleAllowedKeys.includes(propKey) && propValueType === 'ObjectExpression') {
          console.log(propValue);
        }
      });

      console.log('ModuleNamespaced', moduleNamespaced);
    },
  },
};
</script>

<style></style>
