<template>
  <div id="app">
    <div>
      <input v-model="moduleName" style="width: 100%; margin-bottom: 5px;" placeholder="Enter module name" />
      <br />
      <textarea v-model="code" style="width: 100%; height: 500px;" placeholder="Enter module code"></textarea>
    </div>
    <div>
      <button @click="parseCode">Parse!</button>
    </div>
    <div style="padding-top: 5px;">
      <textarea v-model="result" style="width: 100%; height: 500px;" placeholder="Result"></textarea>
    </div>
  </div>
</template>

<script>
import code from 'raw-loader!./data/code.txt';
import { parse } from '@babel/parser';
import prettier from 'prettier/standalone';
import parserBabel from 'prettier/parser-babylon';

export default {
  name: 'App',
  data: () => ({
    moduleName: 'mapData',
    code,
    result: '',
  }),
  methods: {
    parseCode() {
      const parsedCode = parse(this.code, { sourceType: 'module' });
      // console.log(parsedCode);

      const exportDefaultNode = parsedCode.program.body.find(
        node => node.type === 'ExportDefaultDeclaration' && node.declaration.type === 'ObjectExpression',
      );

      if (!exportDefaultNode) {
        console.warn('Export default not found!');
        return;
      }

      const storeData = {};
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
          propValue.forEach(item => {
            const itemName = item.key.name;

            if (!storeData[propKey]) {
              storeData[propKey] = [];
            }

            storeData[propKey].push(itemName);
          });
        }
      });

      console.log('ModuleNamespaced', moduleNamespaced);
      console.log('StoreData', storeData);

      if (!storeData.state && !storeData.getters && !storeData.actions && !storeData.mutations) {
        console.warn('Store items not found!');
        return;
      }

      let mixinCode = "import { mapState, mapGetters, mapActions, mapMutations } from 'vuex';";
      mixinCode += 'export default {';

      if (storeData.state || storeData.getters) {
        mixinCode += 'computed: {';

        if (storeData.state) {
          mixinCode += "...mapState('" + this.moduleName + "', ['" + storeData.state.join("', '") + "']),";
        }

        if (storeData.getters) {
          mixinCode += "...mapGetters('" + this.moduleName + "', ['" + storeData.getters.join("', '") + "']),";
        }

        mixinCode += '},';
      }

      if (storeData.actions || storeData.mutations) {
        mixinCode += 'methods: {';

        if (storeData.actions) {
          mixinCode += "...mapActions('" + this.moduleName + "', ['" + storeData.actions.join("', '") + "']),";
        }

        if (storeData.mutations) {
          mixinCode += "...mapMutations('" + this.moduleName + "', ['" + storeData.mutations.join("', '") + "']),";
        }

        mixinCode += '},';
      }

      mixinCode += '};';

      // console.log(mixinCode);
      this.result = prettier.format(mixinCode, {
        parser: 'babel',
        plugins: [parserBabel],
        quoteProps: 'consistent',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        printWidth: 120,
        jsxSingleQuote: false,
        trailingComma: 'all',
        bracketSpacing: true,
        jsxBracketSameLine: false,
        arrowParens: 'avoid',
      });
    },
  },
};
</script>

<style></style>
